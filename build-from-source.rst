Refer to https://github.com/membase/manifest,

$ mkdir couchbase
$ cd couchbase
$ repo init -u git://github.com/couchbase/manifest.git -m <branch_name>
$ repo sync

subsequently go through the following steps in case you hit problems building
the source.

Getting repo for linux.

> cd ~/bin
> wget http://git-repo.googlecode.com/files/repo-1.19
> mv repo-1.19 repo
> chmod +x repo

Make sure to install snappy, v8 javascript engine. On ubuntu,

> sudo apt-get install snappy libsnappy-dev libv8-dev 

And libmemcached might need,

> sudo apt-get install libcloog-ppl0

You might also need to install paramiko, pycrypto to execute testrunner.

> sudo easy_install paramiko pycrypto

Installing from deb package
---------------------------

Download the latest release for ubuntu.

> dpkg-query -i 

Your first experiment with couchbase
------------------------------------

> cd couchbase/ns_server
> ./cluster_run
> chromium-browser http://127.0.0.1:9000

> couchbase/install/bin/cbworkloadgen -n 127.0.0.1:9000 -i 500000 --prefix=pk1
  -r 0.95 -u <username> -p <password>

And finally, builds that ever got made is available here,
http://builds.hq.northscale.net/latestbuilds/
