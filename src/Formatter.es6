import chalk from 'chalk'
import moment from 'moment'

class Formatter {
  constructor(data) {
    this.data = data
  }
  format() {
    throw new Error('must be overriden')
  }
}

class JSONFormatter extends Formatter {
  format() {
    return JSON.stringify(this.data, 0, 2)
  }
}

class StringFormatter extends Formatter {
  format() {
    var out = ''
    for (var d of data) {
      out += `${chalk.green.bold(d.file)}

      ${chalk.bold('Average age:')} ${moment(d.averageAgeDate).fromNow(true)}
      ${chalk.bold('First Commit:')} ${moment(d.firstCommitDate).fromNow(true)}
      ${chalk.bold('Last Commit:')} ${moment(d.lastCommitDate).fromNow(true)}
      `
    }
  }
}

export default {JSONFormatter: JSONFormatter, StringFormatter: StringFormatter}
