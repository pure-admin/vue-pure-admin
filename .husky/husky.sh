# 加载常用的 Node 管理器环境
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 如果你使用的是 Volta
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

# 确保普通的 bin 路径也在其中
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"