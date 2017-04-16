## Template for development project

Template involves the use of Bootstrap4 https://v4-alpha.getbootstrap.com/ framework with sass (.scss) http://sass-lang.com/ 

To use this template you need to install:

* nodejs https://nodejs.org/en/download/

### Than in command line type:
* node -v
* npm -v
* npm install npm@latest -g
* npm install -g bower

### than go in the root of your project and install dependences from bower.json and package.json
* cd root-your-project/
* npm i
* bower i

### Now you are ready to rock!
* gulp

###To understand how it's work, see the following files :

* ./gulpfile.js - gulp settings
* ./bower.json - bower settings
* ./package.json - npm settings
* ./.bowerrc - bower install path
* ./.gitignore - ignore commit catalogs for git

###File description:

* app/sass/_buildBootstrap.scss - custom build of bootstrap 4 with scss imports (see description in this file for more understanding);
* app/sass/buildBootstrap/_base.scss - customize bootstrap class and other code importing in _buildBootstrap.scss file;
* app/sass/buildBootstrap/_customVariables.scss - customize bootstrap variables;
* app/sass/buildBootstrap/_function.scss - sass function importing in _buildBootstrap;
* app/sass/_media.scss - responsive settings mediaqueries compiled in app/css/main.css;
* app/sass/_fonts.scss - import font settings in app/css/main.css;
* app/sass/_settings.scss - prestyled rules imports in app/sass/main.scss;
* app/sass/libs.scss - in this file import plugins stylesheets (compiled and minifized in app/css/libs.min.css (for more understanding see in ./gulpfile.js));
* app/sass/main.scss - the main custom stylesheet of project linked separatly in head of index.html;