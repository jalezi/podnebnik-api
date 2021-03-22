const { NODE_ENV, PORT } = process.env;
process.env.NODE_ENV = NODE_ENV ? NODE_ENV : 'development';
const port = PORT ? PORT : 5000;

const start = () => {
  import('./src/app.js')
    .then(({ default: app }) => {
      const server = app.listen(port, function () {
        console.log(
          `Server running at ${this.address().address}${this.address().port}`
        );
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
