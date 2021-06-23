const chalk = require("chalk")

const msgPath = process.env.HUSKY_GIT_PARAMS
const msg = require("fs").readFileSync(msgPath, "utf-8").trim()

const commitRE = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.error(
    `  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(
      "不合法的 commit 消息格式"
    )}\n\n` +
    chalk.red("  请使用正确的提交格式:\n\n") +
    `    ${chalk.green("feat: add 'comments' option")}\n` +
    `    ${chalk.green("fix: handle events on blur (close #28)")}\n\n` +
    chalk.red(
      "  请查看 git commit 提交规范：https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md \n"
    )
  )

  process.exit(1)
}
