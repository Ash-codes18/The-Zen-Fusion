var postmark = require("postmark");

// Send an email:
var client = new postmark.ServerClient("282c1d58-85b0-42e1-acb8-a812a977fead");

client.sendEmail({
  "From": "ashmit.mehta@lpu.in",
  "To": "jadhavparth.vinayak@lpu.in",
  "Subject": "Hello boy",
  "HtmlBody": "<strong>Hello</strong> awwwww.",
  "TextBody": "mast ekdum!",
  "MessageStream": "outbound"
}, function(error, result) {
  if (error) {
    console.error("Error sending email:", error.message);
  } else {
    console.log("Email sent successfully:", result.Message);
  }
});
