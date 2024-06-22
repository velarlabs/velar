# velar-cli

[![npm version](https://badge.fury.io/js/velar-cli.svg)](https://badge.fury.io/js/velar-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A command line interface (CLI) tool for the Velar web framework.

## Table of Contents

- [velar-cli](#velar-cli)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Usage](#usage)
      - [Create a New Project](#create-a-new-project)
  - [Run the Development Server](#run-the-development-server)

## Introduction

`velar-cli` is a command-line tool designed to streamline development with the Velar web framework. It provides a set of commands to create, develop, and build Velar projects efficiently.

## Installation

To install `velar-cli`, you need to have Node.js and npm installed. Then, you can install the CLI globally using npm:

```bash
npm install -g velar-cli
```


## Usage
After installing velar-cli, you can use it to create and manage Velar projects.

#### Create a New Project
To create a new Velar project, use the create command followed by your project name:

```bash
velar
```

This will set up a new Velar project in a directory named my-project.

## Run the Development Server
Navigate to your project directory and start the development server:

```bash
cd my-project
npm run dev
```

This will start the development server and you can view your project at http://localhost:8000
