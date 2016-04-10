'use strict';
module.exports = function (ret, conf, settings, opt) {
    var include = settings.include || [],
        exclude = settings.exclude || [],
        rootPath = fis.project.getProjectPath(),
        rootName = rootPath.split(/\\|\//).pop(),
        outputDir,
        filename = 'm2c-op-conf.js',
        wlPath,
        opConfig,
        _include,
        _exclude;



    wlPath = rootPath + '/' + filename;


    if (fis.util.exists(wlPath)) {
        require(wlPath);
    }

    opConfig = fis.config.get('op-config') || {};

    outputDir = opConfig.output || settings.output;

    _exclude = opConfig.exclude || [];

    _include = opConfig.include || [];

    include = include.concat(_include);
    exclude = exclude.concat(_exclude);

    if (!include || include.length == 0) {
        include = ['**.htm*'];
    }

    if (fis.util.is(include, 'Array') && include.length > 0) {
        fis.util.map(ret.src, function (id, file) {
            var filePath = file.toString(),
                newPath;
            if (fis.util.filter(filePath, include, exclude)) {
                if (outputDir) {
                    newPath = (outputDir.replace(/\/$/, '')) + '/' + rootName + '/' + file.id;
                } else {
                    newPath = file.dirname + '/' + file.filename + '.smtpl';
                }
                if (!fis.util.exists(newPath) || !equal(fis.util.read(newPath), file.getContent())) {
                    fis.util.write(newPath, file.getContent());
                }
            };
        });
    }

    function equal(content1, content2) {
        var regExp = /\s*/gmi;
        return content1.toString().replace(regExp, '') === content2.toString().replace(regExp, '');
    }
};
