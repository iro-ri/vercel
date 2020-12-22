const sgMail = require('@sendgrid/mail');
const Cors = require('cors')

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async (req, res) => {
  await cors(req, res)

  const contact = (data) => {
    return {
      to: 'info@iro-ri.jp',
      from: 'info@iro-ri.jp',
      subject: '【イロリ inc.】お問い合わせが入りました',
      text: `【 Category 】 ${data.genre}\n【 Company name 】 ${data.company || ''}\n【 Name 】 ${data.name}\n【 E-Mail address 】 ${data.email}\n【 Content 】${data.content}`,
    };
  }

  const reply = (data) => {
    return {
      to: data.email,
      from: 'info@iro-ri.jp',
      subject: '【イロリ inc.】お問い合わせありがとうございます',
      text: `${data.name} さま\n\nこのたびは、イロリ inc.にお問い合わせいただき、誠にありがとうございます。\n\n以下の内容にてお問い合わせを受け付けました。\n\n3営業日以内に担当者よりご連絡をさせていただきますので\n\nもうしばらくお待ちいただきますようよろしくお願いいたします。\n\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝\n\n【 Category 】 ${data.genre}\n【 Company name 】 ${data.company || ''}\n【 Name 】 ${data.name}\n【 E-Mail address 】 ${data.email}\n【 Content 】${data.content}\n\n＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝`,
    };
  }

  if (req.method === 'POST') {
    sgMail.setApiKey('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');

    try {
      await sgMail.send(reply(req.body));
      await sgMail.send(contact(req.body));
      res.statusCode = 200
      res.json({
        message: 'success'
      })
    } catch (error) {
      if (error.response) {
        console.error(error.response.body)
      }
      res.statusCode = 400
      res.json(error.response.body)
    }
  } else {
    res.statusCode = 200
  }

}
