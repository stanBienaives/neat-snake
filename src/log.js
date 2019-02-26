
class Log {

  static debug (...args) {
    if (process.env.LOG_LEVEL === 'debug')
      Log._write('DEBUG', ...args);
  }

  static info (...args) {
    Log._write('INFO', ...args);
  }

  static _write (mode, ...args) {
    console.log(`${mode}:`, ...args)
  }
}


module.exports = Log;