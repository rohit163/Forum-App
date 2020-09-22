const User = require('../models/auth.model')
// JWT is used for authentication
const expressJwt = require('express-jwt')
//google this thing quite complicated
const _ = require('lodash')
//for google auth
const { OAuth2Client } = require('google-auth-library')
//it is an iplementation of the native Fetch API for Node.js.
//It's basically the same as window
const fetch = require('node-fetch')
// it is an Express middleware library that you can incorporate in your apps for server-side data validation.
const { validationResult } = require('express-validator')
//search on YT for better understanding
const jwt = require('jsonwebtoken')
//custom error handler to get useful error form DB errors
const { errorHandler } = require('../helper/dbErrorHandling')
//send grid is used to send mail to the user.....nodemail is and alternative to this
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.MAIL_KEY)



// exports.registerController = (req, res) => {
//     const { name, email, password } = req.body

//     const errors = validationResult(req)

//     //validation to req, body we will create custon validation in seconds
//     if (!errors.isEmpty()) {
//         const firstError = errors.array().map(error => error.msg)[0]
//         return res.status(422).json({
//             error: firstError
//         })
//     } else {
//         User.findOne({
//             email
//         }).exec((err, user) => {
//             //if user exiss
//             if (user) {
//                 return res.status(400).json({
//                     error: "email is taken"
//                 })
//             }
//         })
//         //Generete token 
//         const token = jwt.sign(
//             {
//                 name,
//                 email,
//                 password
//             },
//             process.env.JWT_ACCOUNT_ACTIVATION, {
//             expiresIn: '5m'
//         }
//         )
//         //email data sending
//         const emailData = {
//             from: process.env.EMAIL_FROM,
//             to: email,
//             subject: 'Account activation link',
//             html: `
//             <h1>Please use the following to activate your account</h1>
//             <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
//             <hr />
//             <p>This email may containe sensetive information</p>
//             <p>${process.env.CLIENT_URL}</p>
//             `
//         };
//         sgMail.send(emailData).then(sent => {
//             return res.json({
//                 message: `Email has been sent to ${email}`
//             });
//         }).catch(err => {
//             return res.status(400).json({
//                 success: false,
//                 error: errorHandler(err)
//             });
//         });
//     }
// };

exports.registerController = (req, res) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            if (user) {
                return res.status(400).json({
                    errors: 'Email is taken'
                });
            }
        })


        const token = jwt.sign(
            {
                name,
                email,
                password
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '5m'
            }
        );

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Account activation link',
            html: `
                  <h1>Please use the following to activate your account</h1>
                  <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                  <hr />
                  <p>This email may containe sensetive information</p>
                  <p>${process.env.CLIENT_URL}</p>
              `
        };

        sgMail
            .send(emailData)
            .then(sent => {
                return res.json({
                    message: `Email has been sent to ${email}`
                });
            })
            .catch(err => {
                return res.status(400).json({
                    success: false,
                    errors: errorHandler(err)
                });
            });
    }
};

//register For backend nor create frointend for it

//activation controller and save to DB

// exports.activationController = (req, res) => {
//     const { token } = req.body
//     if (token) {
//         //verify the token is valid or not or expired
//         jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION,
//             (err, decoded) => {
//                 if (err) {
//                     return res.status(401).json({
//                         error: 'Expired Token. Signup again'
//                     })
//                 } else {
//                     //if valid save to DB
//                     //get name eamil passwor from token
//                     const { name, email, password } = jwt.decode(token)
//                     const user = new User({
//                         name,
//                         email,
//                         password
//                     });
//                     user.save((err, user) => {
//                         if (err) {
//                             return res.status(401).json({
//                                 error: errorHandler(err)
//                             })
//                         } else {
//                             return res.json({
//                                 success: true,
//                                 // message: user,
//                                 message: 'signup success'

//                             });
//                         }
//                     });
//                 }
//             });
//     } else {
//         return res.json({
//             message: 'error happening pls try again'
//         });
//     }
// };


exports.activationController = (req, res) => {
    const { token } = req.body;

    if (token) {
        //verify the token is valid or not or expired
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
            if (err) {
                console.log('Activation error');
                return res.status(401).json({
                    errors: 'Expired link. Signup again'
                });
            } else {
                const { name, email, password } = jwt.decode(token);

                console.log(email);
                const user = new User({
                    name,
                    email,
                    password
                });

                user.save((err, user) => {
                    if (err) {
                        //if valid save to DB
                        //get name eamil passwor from token
                        console.log('Save error', errorHandler(err));
                        return res.status(401).json({
                            errors: errorHandler(err)
                        });
                    } else {
                        return res.json({
                            success: true,
                            // message: user,
                            message: 'Signup success',
                            user
                        });
                    }
                });
            }
        });
    } else {
        return res.json({
            message: 'error happening please try again'
        });
    }
};

exports.loginController = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    //validation to req.body ....... create custom validation
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        // check if user exist
        User.findOne({
            email
        }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    errors: 'User with that email does not exist. Please signup'
                });
            }
            // authenticate
            if (!user.authenticate(password)) {
                return res.status(400).json({
                    errors: 'Email and password do not match'
                });
            }
            //generate token
            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d' //token vaild in 7 day  we can also keep remember me in front and set it for 30d
                }
            );
            const { _id, name, email, role } = user;
            return res.json({
                token,
                user: {
                    _id,
                    name,
                    email,
                    role
                }
            });
        })
    }
}


exports.forgotPasswordController = (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        //find if user exists
        User.findOne(
            {
                email
            },
            (err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        error: 'User with that email does not exist'
                    });
                }
                //if user exists
                // generate token for user with this id valid only for 10 min
                const token = jwt.sign(
                    {
                        _id: user._id
                    },
                    process.env.JWT_RESET_KEY,
                    {
                        expiresIn: '10m'
                    }
                );
                //send emaul with this token

                const emailData = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: 'Password Reset link',
                    html: `
                          <h1>Please use the following link to reset your password</h1>
                          <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                          <hr />
                          <p>This email may containe sensetive information</p>
                          <p>${process.env.CLIENT_URL}</p>
                      `
                };

                return user.updateOne(
                    {
                        resetPasswordLink: token
                    },
                    (err, success) => {
                        if (err) {
                            console.log('RESET PASSWORD LINK ERROR', err);
                            return res.status(400).json({
                                error:
                                    'Database connection error on user password forgot request'
                            });
                        } else {
                            //send eamil
                            sgMail.send(emailData).then(sent => {
                                console.log('SIGNUP EMAIL SENT', sent)
                                return res.json({
                                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                                });
                            })
                                .catch(err => {
                                    console.log('SIGNUP EMAIL SENT ERROR', err)
                                    return res.json({
                                        message: err.message
                                    });
                                });
                        }
                    }
                );
            }
        );
    }
};



exports.resetPasswordController = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    const errors = validationResult(req);
    //validation to req, body  will creaet custom valiation
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors: firstError
        });
    } else {
        if (resetPasswordLink) {
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_KEY, function (
                err,
                decoded
            ) {
                if (err) {
                    return res.status(400).json({
                        error: 'Expired link. Try again'
                    });
                }

                User.findOne(
                    {
                        resetPasswordLink
                    },
                    (err, user) => {
                        if (err || !user) {
                            return res.status(400).json({
                                error: 'Something went wrong. Try later'
                            });
                        }

                        const updatedFields = {
                            password: newPassword,
                            resetPasswordLink: ''
                        };

                        user = _.extend(user, updatedFields);

                        user.save((err, result) => {
                            if (err) {
                                return res.status(400).json({
                                    error: 'Error resetting user password'
                                });
                            }
                            res.json({
                                message: `Great! Now you can login with your new password`
                            });
                        });
                    }
                );
            });
        }
    }
};