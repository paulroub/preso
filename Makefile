lint:
	npx eslint -c .eslintrc-node.js app.js routes tests
	npx eslint public/javascripts
	sass-lint public/stylesheets/*.scss -v

run:	build
	npm start &
	sleep 10
	open http://localhost:3000/

build:
	cd highlight.js && \
		npm install && \
		node tools/build.js :common
	mkdir -p public/highlight
	cp highlight.js/build/demo/styles/default.css public/highlight/highlight.css
	cp highlight.js/build/highlight.pack.js public/highlight/highlight.js

export:
	mkdir -p _export/images _export/scripts _export/tddmash
	sass --sourcemap=none _assets/style.scss _export/style.css
	cp _assets/slides.js _export/scripts
	cp -R public/images/* _export/images
	cp -R public/tddmash/* _export/tddmash
	rm -rf _export/tddmash/.git
	python bin/export.py > _export/index.html
	cd _export && zip -9rp tdd-codemash2020.zip *
