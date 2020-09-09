<div align="center">
  <h1>Blog App</h1>
</div>

## Project Installation Guide

### Environment files

Environment file can be found in [this](https://gist.github.com/borabaloglu/6cdd920b3da3038c7e4053e6fddc0c5e) gist. This file must be added to root of the project with the file name `.dev.env`. Without this file, the project cannot be run.

### PostgreSQL

#### Installation

You can follow installation steps from [here](https://www.postgresql.org/download/).

#### Preparing for project

##### OS X

```bash
$ psql postgres
$ create database blog
$ create user blog_user with encrypted password 'blog_pass'
$ grant all privileges on database blog to blog_user;
```

##### Linux

```bash
$ sudo -u postgres psql
$ create database blog
$ create user blog_user with encrypted password 'blog_pass'
$ grant all privileges on database blog to blog_user;
```

##### Windows

```bash
$ psql -U postgres
$ create database blog
$ create user blog_user with encrypted password 'blog_pass'
$ grant all privileges on database blog to blog_user;
```
