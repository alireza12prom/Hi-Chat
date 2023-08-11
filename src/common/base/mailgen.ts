import Mailgen from 'mailgen';

export const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Hi Chat',
    link: 'https://hichat.com/',
  },
});
