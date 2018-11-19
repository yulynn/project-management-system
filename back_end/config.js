module.exports = {
	'network' : {
		'port':8080
	},	
	'jwtsecret': 'projectjwt',
	mailOptions: {
	    from: '296812102@qq.com', // sender address
	    to: 'zeng32@qq.com', // receiver address
	    subject: 'default subject', // title
	    // text or html
	    text: 'default content'
	},
	transporter: {
	    // https://github.com/andris9/nodemailer-wellknown#supported-services
	    service: 'qq',
	    port: 465, // SMTP port
	    secureConnection: true, // use SSL
	    auth: {
	        user: '441535867@qq.com',
	        // smtp password
	        pass: 'bgypznytpojxbhbf'
	    }
	}
};