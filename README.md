<div align="center">
  <h1>Blog App</h1>
</div>

## Project Installation Guide

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
