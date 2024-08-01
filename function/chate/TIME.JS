const hour =
  new Date().getHours() < 10
    ? `0${new Date().getHours()}`
    : `${new Date().getHours()}`;

const mins =
  new Date().getMinutes() < 10
    ? `0${new Date().getMinutes()}`
    : `${new Date().getMinutes()}`;
const secaonds =
  new Date().getSeconds() < 10
    ? `0${new Date().getSeconds()}`
    : `${new Date().getSeconds()}`;

const time = `${hour}:${mins}:${secaonds}`;
module.exports = time;
