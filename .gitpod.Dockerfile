FROM gitpod/workspace-full

RUN sudo apt-get update \
  && sudo apt-get install -y \
    g++ gcc make python2.7 pkg-config libx11-dev libxkbfile-dev libsecret-1-dev python-is-python3 rsync \
  && sudo rm -rf /var/lib/apt/lists/*

RUN bash -c 'VERSION="16.17.0" && source $HOME/.nvm/nvm.sh && nvm install $VERSION  && nvm use $VERSION && nvm alias default $VERSION'

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix
