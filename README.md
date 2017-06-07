# account-info-api-spec

# Usage
```npm run start```  builds the project and runs a local webserver on http://localhost:8080/ serving the swagger spec using the spectacles-docs format

# Scripts
```npm run test``` runs the tests , validate swagger spec against the swagger schema (not the editor!!)

```npm run flatten-schemas``` flattens the schemas in the schema folder<br>
```npm run compile-swagger``` dereference the swagger spec split from  several yaml files to one fully dereferenced yaml file , dereferencing the schemas compiled using npm run flatten-schemas


****WIP Documentation****
To convert SwaggerSpec to MARKDOWN
You need to have
1) swagger2markup-cli-1.3.1.jar  -> http://swagger2markup.github.io/swagger2markup/1.3.1/#_command_line_interface
2) asciidoctor
   gem install asciidoctor
3) ruby 2.2
4) asciidoctor-pdf
(ruby v2.2)
- rvm install 2.2
- rvm use 2.2
- gem install --pre asciidoctor-pdf
- gem uninstall prawn
- gem install prawn -v 2.1.0

# Troubleshooting
 
If you run `npm run build:all` and there are errors in a new terminal session, 
issuing the command `rvm use 2.2` may fix it 
