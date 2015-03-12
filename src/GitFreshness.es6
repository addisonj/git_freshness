import {exec} from 'child_process'
import async from 'async'

class GitFreshness {
  constructor(repoPath) {
    this.repoPath = repoPath || process.cwd()
    this.startTime = Date.now()
  }
  splitOutput(output) {
    return output.split('\n').filter((l) => l.length > 0)
  }
  execCommand(command, cb) {
    exec(command, {cwd: this.repoPath}, (err, stdout) => {
      cb(err, this.splitOutput(stdout))
    })
  }
  getCommitDates(file, cb) {
    this.execCommand(`git log --follow --pretty=format:"%ad" ${file}`, (err, lines) => {
      if (err) return cb(err)

      cb(null, {
        first: new Date(lines[lines.length - 1]),
        last: new Date(lines[0])
      })
    })
  }
  computeAgeForFile(file, cb) {
    var c = `git blame -w -c ${file} | cut -f 3`
    this.execCommand(c, (err, lines) => {
      if (err) return cb(err)
      getCommitDates(file, (err, dates) => {
        if (err) return cb(err)
        var total = lines.length
        var times = lines.map((line) => {
          var d = Date.parse(line)
          return this.startTime - d.valueOf()
        })
        var sum = times.reduce((a, b) => a + b, 0)
        var age = new Date()
        age.setTime(this.startTime - Math.round(sum / total))
        cb(null, {
          file: file,
          averageAgeDate: age,
          lines: total,
          firstCommitDate: dates.first,
          lastCommitDate: dates.last
        })
      })
    })
  }
  getFiles(cb) {
    // use this semi hacky way to avoid binary files
    this.execCommand('git grep -I --name-only -e ""', cb)
  }
  run(cb) {
    this.getFiles((err, files) => {
      if (err) return cb(err)
      async.map(files, computeAgeForFile, cb)
    })
  }
}

export default GitFreshness
