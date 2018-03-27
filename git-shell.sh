#!/bin/sh

now="$(date +'%Y%m%d%H%M%S')"
devBranch="dev"
releaseBranch="release"
masterBranch="master"

mergeRelease() {
    git checkout ${devBranch}
    git pull
    git push
    git checkout ${releaseBranch}
    git pull
    git merge --no-ff ${devBranch}
    git push
}

mergeMaster() {
    git checkout ${masterBranch}
    git pull
    git branch "${masterBranch}_bak_${now}"
    git merge --no-ff ${releaseBranch}
    git push
    git tag "v${now}"
    git tags
}

echo 'a、推送代码到生产环境'
echo 'b、合并生产环境代码到master分支'
echo '请根据字母选择您的操作：'

read isOk

case $isOk in
    a)
        mergeRelease
        break
        ;;
    b)
        mergeMaster
        break
        ;;
    *)
        echo '无效的选择'
        break
        ;;
esac
