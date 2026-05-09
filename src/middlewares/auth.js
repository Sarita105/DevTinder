const authMiddleware = (req, res, next) => {
  console.log('auth middleware checking!!');
  const token = 'xyz';
  if (token === 'xyz') {
    next();
  } else {
    res.status(401).send('unauthorized access!! Cant let you in!!');
  }
}

const authUserMiddleware = (req, res, next) => {
  console.log('auth middleware checking!!');
  const token = 'xyz';
  if (token === 'xyz') {
    next();
  } else {
    res.status(401).send('unauthorized access!! Cant let you in!!');
  }
}
module.exports = {
  authMiddleware,
  authUserMiddleware
}