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
java -jar ..\make\yuicompressor-2.3.6.jar engine.baseobject.js > ..\min-js\engine\engine.baseobject.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.container.js > ..\min-js\engine\engine.container.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.events.js > ..\min-js\engine\engine.events.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.game.js > ..\min-js\engine\engine.game.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.hostobject.js > ..\min-js\engine\engine.hostobject.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.js > ..\min-js\engine\engine.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.math2d.js > ..\min-js\engine\engine.math2d.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.object2d.js > ..\min-js\engine\engine.object2d.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.particles.js > ..\min-js\engine\engine.particles.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.pooledobject.js > ..\min-js\engine\engine.pooledobject.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.rendercontext.js > ..\min-js\engine\engine.rendercontext.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.resourceloader.js > ..\min-js\engine\engine.resourceloader.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.spatialcontainer.js > ..\min-js\engine\engine.spatialcontainer.js
java -jar ..\make\yuicompressor-2.3.6.jar engine.timers.js > ..\min-js\engine\engine.timers.js
@cd ..


:: COMPONENTS --------------------------------
@cd components
java -jar ..\make\yuicompressor-2.3.6.jar component.base.js > ..\min-js\components\component.base.js
java -jar ..\make\yuicompressor-2.3.6.jar component.collider.js > ..\min-js\components\component.collider.js
java -jar ..\make\yuicompressor-2.3.6.jar component.host.js > ..\min-js\components\component.host.js
java -jar ..\make\yuicompressor-2.3.6.jar component.input.js > ..\min-js\components\component.input.js
java -jar ..\make\yuicompressor-2.3.6.jar component.keyboardinput.js > ..\min-js\components\component.keyboardinput.js
java -jar ..\make\yuicompressor-2.3.6.jar component.logic.js > ..\min-js\components\component.logic.js
java -jar ..\make\yuicompressor-2.3.6.jar component.mouseinput.js > ..\min-js\components\component.mouseinput.js
java -jar ..\make\yuicompressor-2.3.6.jar component.mover2d.js > ..\min-js\components\component.mover2d.js
java -jar ..\make\yuicompressor-2.3.6.jar component.notifier.js > ..\min-js\components\component.notifier.js
java -jar ..\make\yuicompressor-2.3.6.jar component.render.js > ..\min-js\components\component.render.js
java -jar ..\make\yuicompressor-2.3.6.jar component.sprite.js > ..\min-js\components\component.sprite.js
java -jar ..\make\yuicompressor-2.3.6.jar component.transform2d.js > ..\min-js\components\component.transform2d.js
java -jar ..\make\yuicompressor-2.3.6.jar component.vector2d.js > ..\min-js\components\component.vector2d.js
java -jar ..\make\yuicompressor-2.3.6.jar component.wiimoteinput.js > ..\min-js\components\component.wiimoteinput.js
@cd ..


:: RENDER CONTEXTS --------------------------------
@cd rendercontexts
java -jar ..\make\yuicompressor-2.3.6.jar context.canvascontext.js > ..\min-js\rendercontexts\context.canvascontext.js
java -jar ..\make\yuicompressor-2.3.6.jar context.documentcontext.js > ..\min-js\rendercontexts\context.documentcontext.js
java -jar ..\make\yuicompressor-2.3.6.jar context.htmlelement.js > ..\min-js\rendercontexts\context.htmlelement.js
java -jar ..\make\yuicompressor-2.3.6.jar context.render2d.js > ..\min-js\rendercontexts\context.render2d.js
java -jar ..\make\yuicompressor-2.3.6.jar context.scrollingbackground.js > ..\min-js\rendercontexts\context.scrollingbackground.js
java -jar ..\make\yuicompressor-2.3.6.jar context.svgcontext.js > ..\min-js\rendercontexts\context.svgcontext.js
java -jar ..\make\yuicompressor-2.3.6.jar context.wzgraphicscontext.js > ..\min-js\rendercontexts\context.wzgraphicscontext.js
@cd ..


:: RESOURCE LOADERS --------------------------------
@cd resourceloaders
java -jar ..\make\yuicompressor-2.3.6.jar loader.bitmapfont.js > ..\min-js\resourceloaders\loader.bitmapfont.js
java -jar ..\make\yuicompressor-2.3.6.jar loader.image.js > ..\min-js\resourceloaders\loader.image.js
java -jar ..\make\yuicompressor-2.3.6.jar loader.level.js > ..\min-js\resourceloaders\loader.level.js
java -jar ..\make\yuicompressor-2.3.6.jar loader.object.js > ..\min-js\resourceloaders\loader.object.js
java -jar ..\make\yuicompressor-2.3.6.jar loader.sound.js > ..\min-js\resourceloaders\loader.sound.js
java -jar ..\make\yuicompressor-2.3.6.jar loader.sprite.js > ..\min-js\resourceloaders\loader.sprite.js
java -jar ..\make\yuicompressor-2.3.6.jar loader.xml.js > ..\min-js\resourceloaders\loader.xml.js
@cd ..


:: SPATIAL CONTAINERS --------------------------------
@cd spatial
java -jar ..\make\yuicompressor-2.3.6.jar container.quadtree.js > ..\min-js\spatial\container.quadtree.js
java -jar ..\make\yuicompressor-2.3.6.jar container.spatialgrid.js > ..\min-js\spatial\container.spatialgrid.js
@cd ..


:: TEXT RENDERING --------------------------------
@cd textrender
java -jar ..\make\yuicompressor-2.3.6.jar text.abstractrender.js > ..\min-js\textrender\text.abstractrender.js
java -jar ..\make\yuicompressor-2.3.6.jar text.bitmap.js > ..\min-js\textrender\text.bitmap.js
java -jar ..\make\yuicompressor-2.3.6.jar text.renderer.js > ..\min-js\textrender\text.renderer.js
java -jar ..\make\yuicompressor-2.3.6.jar text.vector.js > ..\min-js\textrender\text.vector.js
@cd ..


@ECHO ### Complete ###