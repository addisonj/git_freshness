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
  diffDate(start, earlier) {
    var days = start.diff(earlier, 'days')
    if (days === 1) {
      return days + ' day'
    } else {
      return days + ' days'
    }
  }
  format() {
    var out = ''
    var startTime = moment()
    this.data.forEach((d) => {
      out += `
File: ${chalk.red.bold.underline(d.file)}
  ${chalk.bold('Average age:')} ${this.diffDate(startTime, d.averageAgeDate)} old
  ${chalk.bold('First Commit:')} ${this.diffDate(startTime, d.firstCommitDate)} ago
  ${chalk.bold('Last Commit:')} ${this.diffDate(startTime, d.lastCommitDate)} ago

      `
    })
    return out
  }
}

export default {JSONFormatter: JSONFormatter, StringFormatter: StringFormatter}
