const { NODE_ENV, PORT } = process.env;
process.env.NODE_ENV = NODE_ENV ? NODE_ENV : 'development';
const port = PORT ? PORT : 5000;

const isDev = process.env.NODE_ENV === 'development';

const start = () => {
  import('./src/app.js')
    .then(({ default: app }) => {
      const server = app.listen(port, function () {
        const path = isDev
          ? `http://localhost:${this.address().port}`
          : `${this.address().address}${this.address().port}`;

        console.log(`Server running at ${path}`);
      });
      process.on('SIGTERM', () => {
        console.info('SIGTERM signal received.');
        console.log('Closing http server.');
        server.close(() => {
          console.log('Http server closed.');
        });
      });
    })
    .catch(error => {
      console.log(error);
    });
};

start();
