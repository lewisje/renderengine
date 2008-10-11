:: The Render Engine, Make Package -- (c)2008 Brett Fattori

:: == Create the minified package structure ==
@rmdir /S /Q min-js
@mkdir min-js
@cd min-js
@mkdir engine
@mkdir components
@mkdir rendercontexts
@mkdir resourceloaders
@mkdir spatial
@mkdir textrender
@mkdir css
@mkdir fonts
@mkdir libs
@mkdir objects
@cd ..

:: == Copy files we're not going to be minifying ==

:: FONTS --------------------------------
@cd fonts
@copy *.js ..\min-js\fonts
@copy *.png ..\min-js\fonts

:: SUPPORT LIBRARIES --------------------------------
@cd ..
@cd libs
@copy base.js ..\min-js\libs
@copy sylvester.js ..\min-js\libs
@copy jquery-1.2.2.js ..\min-js\libs
@copy jquery.ext.engine.js ..\min-js\libs
@copy soundmanager2.js ..\min-js\libs
@copy wz_jsgraphics.js ..\min-js\libs
@copy *.swf ..\min-js\libs

:: CSS --------------------------------
@cd ..
@cd css
@copy *.css ..\min-js\css
@copy *.png ..\min-js\css
@copy *.jpg ..\min-js\css
@copy *.gif ..\min-js\css

:: == Make sure the license follows the engine around!! ==
@cd ..
@copy MIT_LICENSE.txt .\min-js

:: ---------------------------------------------------------------------------

:: == Minify each of the package files, then move into ==
:: == the minified structure ==

:: ENGINE --------------------------------
@cd engine
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.baseobject.js > ..\min-js\engine\engine.baseobject.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.container.js > ..\min-js\engine\engine.container.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.events.js > ..\min-js\engine\engine.events.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.game.js > ..\min-js\engine\engine.game.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.hostobject.js > ..\min-js\engine\engine.hostobject.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.js > ..\min-js\engine\engine.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.math2d.js > ..\min-js\engine\engine.math2d.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.object2d.js > ..\min-js\engine\engine.object2d.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.particles.js > ..\min-js\engine\engine.particles.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.pooledobject.js > ..\min-js\engine\engine.pooledobject.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.rendercontext.js > ..\min-js\engine\engine.rendercontext.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.resourceloader.js > ..\min-js\engine\engine.resourceloader.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.spatialcontainer.js > ..\min-js\engine\engine.spatialcontainer.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge engine.timers.js > ..\min-js\engine\engine.timers.js
@cd ..


:: COMPONENTS --------------------------------
@cd components
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.base.js > ..\min-js\components\component.base.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.collider.js > ..\min-js\components\component.collider.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.host.js > ..\min-js\components\component.host.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.input.js > ..\min-js\components\component.input.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.keyboardinput.js > ..\min-js\components\component.keyboardinput.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.logic.js > ..\min-js\components\component.logic.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.mouseinput.js > ..\min-js\components\component.mouseinput.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.mover2d.js > ..\min-js\components\component.mover2d.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.notifier.js > ..\min-js\components\component.notifier.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.render.js > ..\min-js\components\component.render.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.sprite.js > ..\min-js\components\component.sprite.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.transform2d.js > ..\min-js\components\component.transform2d.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.vector2d.js > ..\min-js\components\component.vector2d.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge component.wiimoteinput.js > ..\min-js\components\component.wiimoteinput.js
@cd ..


:: RENDER CONTEXTS --------------------------------
@cd rendercontexts
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge context.canvascontext.js > ..\min-js\rendercontexts\context.canvascontext.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge context.documentcontext.js > ..\min-js\rendercontexts\context.documentcontext.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge context.htmlelement.js > ..\min-js\rendercontexts\context.htmlelement.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge context.render2d.js > ..\min-js\rendercontexts\context.render2d.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge context.scrollingbackground.js > ..\min-js\rendercontexts\context.scrollingbackground.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge context.svgcontext.js > ..\min-js\rendercontexts\context.svgcontext.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge context.wzgraphicscontext.js > ..\min-js\rendercontexts\context.wzgraphicscontext.js
@cd ..


:: RESOURCE LOADERS --------------------------------
@cd resourceloaders
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge loader.bitmapfont.js > ..\min-js\resourceloaders\loader.bitmapfont.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge loader.image.js > ..\min-js\resourceloaders\loader.image.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge loader.level.js > ..\min-js\resourceloaders\loader.level.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge loader.object.js > ..\min-js\resourceloaders\loader.object.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge loader.sound.js > ..\min-js\resourceloaders\loader.sound.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge loader.sprite.js > ..\min-js\resourceloaders\loader.sprite.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge loader.xml.js > ..\min-js\resourceloaders\loader.xml.js
@cd ..


:: SPATIAL CONTAINERS --------------------------------
@cd spatial
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge container.quadtree.js > ..\min-js\spatial\container.quadtree.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge container.spatialgrid.js > ..\min-js\spatial\container.spatialgrid.js
@cd ..


:: TEXT RENDERING --------------------------------
@cd textrender
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge text.abstractrender.js > ..\min-js\textrender\text.abstractrender.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge text.bitmap.js > ..\min-js\textrender\text.bitmap.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge text.renderer.js > ..\min-js\textrender\text.renderer.js
java -jar ..\make\yuicompressor-2.3.6.jar --nomunge text.vector.js > ..\min-js\textrender\text.vector.js
@cd ..


@ECHO ### Complete ###