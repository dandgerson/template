## Template for development project

Template involves the use of Bootstrap4 https://v4-alpha.getbootstrap.com/ framework with sass (.scss) http://sass-lang.com/ 

To understand more, see the following files :

* gulpfile.js
* bower.json
* package.json
* .bowerrc
* .gitignore

files description:

* app/sass/_buildBootstrap.scss - custom build of bootstrap 4 with scss imports (see description in this file for more understanding);
* app/sass/buildBootstrap/_base.scss - custom code importing in _buildBootstrap.scss file;
* app/sass/buildBootstrap/_customVariables.scss - rewriting variables of bootstrap;
* app/sass/buildBootstrap/_function.scss - sass function importing in _buildBootstrap;
* app/sass/_media.scss - responsive settings mediaqueries compiled in app/css/main.css;
* app/sass/_settings.scss - prestyled rules imports in app/sass/main.scss;
* app/sass/libs.scss - in this file importings plugins stylesheets (compiled and minifized in app/css/libs.min.css (for more understanding see in ./gulpfile.js));
* app/sass/main.scss - the main custom stylesheet of project linked separatly in <head> tag .html;
``