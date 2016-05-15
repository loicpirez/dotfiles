child_process = require 'child_process'
path = require 'path'
fs = require 'fs'

module.exports = class LinterProvider

  getCommand = (textEditor, fileName) ->
    cmd = atom.config.get 'epitech-norm-linter.a_pythonPath'
    cmd += " ../norminette/norm.py -libc"
    cmd += " " + fileName   #textEditor.getPath()
    cmd += " -nocheat -malloc"
    if (!atom.config.get 'epitech-norm-linter.c_verifyComment')
      cmd += " -comment"
    if (atom.config.get 'epitech-norm-linter.e_verifyLibc')
      cmd += " -libc"
    if (atom.config.get 'epitech-norm-linter.f_showDebug')
      console.log("Epitech-norm-linter: " + cmd)
    return cmd

  lintFile = (textEditor, fileName) =>
    return new Promise (resolve) ->
      data = ''
      cmd = getCommand(textEditor, fileName)
      process = child_process.exec(cmd, {cwd: __dirname})
      process.stdout.on 'data', (d) -> data = d.toString()
      process.on 'close', ->
        toReturn = []
        if (atom.config.get 'epitech-norm-linter.f_showDebug')
          console.log("Output norminette: " + data)
        for line in data.split('\n')
          if line.match(/^Erreur/i)
            linenb = (line.split(' ')[6]).split(':')[0];
            error = (line.split(':')[1]).split("=>")[0];
            toReturn.push(
              type: "Norme",
              text: "Faute de norme à la ligne " + linenb + " : " + error,
              range: [[parseInt(linenb, 10) - 1, 0], [parseInt(linenb, 10) - 1, 1000000]],
              filePath: textEditor.getPath())
        resolve toReturn

  lintOnFly = (textEditor) =>
    path = __dirname + "/../norminette/tempNormLinter.c"
    fs.writeFile path, textEditor.getText().toString(), (err) =>
       if (err)
        throw err;
      if (atom.config.get 'epitech-norm-linter.f_showDebug')
        console.log("File saved ! Path: " + path);
      lintFile(textEditor, path);

  lintOnSave = (textEditor) =>
    lintFile(textEditor, textEditor.getPath())

  lint: (textEditor) =>
    if (atom.config.get('epitech-norm-linter.b_lintOnFly'))
      lintOnFly(textEditor)
    else
      lintOnSave(textEditor)
