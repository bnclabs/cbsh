cbsh - couchbase shell.

For basic command line interface there is couchbase-cli and associated
scripts. This tool is intended for users who end up interacting with couchbase
server more frequently, it is also intended for developers who create custom
map-reduce functions a.k.a views.

Below is a list of features that should be available from this tool. Note that
this tool is still taking shape and most of the features are just in proposal
phase. In case you are interested post me.

- interactive shell, similar to node.js
- written in node/javascript, hence javascript can be used inside the shell.
- couchbase commands always start in a new line and are prefixed with a '/',
  eg.

  - /versions
  - /pools

- connect to any number of servers and connections are kept active.

  - slash commands are convenient ways to access couch-base's REST API.
  - switch between servers using slash command.
  - switch between buckets using slash command.
  - switch between design-docs withing buckets using slash command.
  - current context of server, bucket, design-doc will be highlighted in the
    prompt, like, ``myserver.com/mybybucket/ddoc>``.
  - doing ``../../../anotherserver.com``, will change context to
    ``anotherserver.com>``.
  - doing ``../../../anotherserver.com/anotherbucket`` will change context to
    ``anotherserver.com/anotherbucket>``.

- tab-completion for javascript, slash-commands. tab completions can be
  extended for individual commands.
- new commands can be added using extension APIs.
- write scripts to monitor clusters and nodes, collect their statistics.
- render the monitored stats as xml file, text tables or image graphs.
- while developing map-reduce functions,

  - source design doc from local directory and load them into shell environment.
  - pull one or more documents from server and apply map - reduce functions on
    them.
  - repeate the cycle of development until satisfied with map, reduce logic.
  - push view into the server.

dependencies
------------

This project depends on the following package. Since they are installed and
managed along with this source-base you don't need to install them again. This
might change in future though.

.. code-block:: bash

    npm install optimize underscore underscore.string colors

