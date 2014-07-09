var utility = {
    testData: {
        dataSrc: 'https://www.telerik.com/sfimages/default-source/logos/telerik-logo-reversed.png',
        httpDataSrc: 'http://www.telerik.com/sfimages/default-source/logos/telerik-logo-reversed.png',
        resizeServiceUrl: 'https://bs1.cdn.telerik.com/image/v1/kZddAw6QIAzVkjDl'
    },

    getImageInDivHtml: function(divId, imageUrl, divWidth, divHeight) {
        if(!divWidth) divWidth = 600;
        if(!divHeight) divHeight = 300;

        var divHtml = '<div style="width: {divWidth}px; height: {divHeight}px;">'.replace('{divWidth}', divWidth).replace('{divHeight}', divHeight);
        divHtml += '<img id="{divId}" data-src="{imageUrl}" class="resimgs" />'.replace('{divId}', divId).replace('{imageUrl}', imageUrl);
        divHtml += '</div>';
        return divHtml;
    }
};


QUnit.asyncTest("Can resize 1 image by parent container size", function( assert ) {
	// Arrange
	expect(3); // expect three asserts

	var $fixture = $("#qunit-fixture");

    $fixture.append(utility.getImageInDivHtml('test-img', utility.testData.dataSrc));
	
	var _onReady = function(data) {
		// Assert
        var expectedSrc = utility.testData.resizeServiceUrl + '/resize=w:600,pd:1/' + utility.testData.dataSrc;

        assert.equal(data.count, 1, 'Only 1 image should have been processed.');
        assert.ok(data.items[0].src, 'The item was not processed properly.');

        var actualSrc = $fixture.find('#test-img').attr('src');
        assert.equal(actualSrc, expectedSrc);

        QUnit.start();
	}

	// Act
	everliveImages.init({
		apiKey: 'kZddAw6QIAzVkjDl',
		ssl: true,
		onReady: _onReady
	});
});

QUnit.asyncTest("Can resize 3 images by parent container size", function( assert ) {
    // Arrange
    expect(4); // expect three asserts

    var $fixture = $("#qunit-fixture");

    var beginWidth = 100;
    for(var i=1;i<=3;i++) {
        $fixture.append(utility.getImageInDivHtml('test-img'+i, utility.testData.dataSrc, beginWidth * i))
    }

    var _onReady = function(data) {
        // Assert
        assert.equal(data.count, 3, '3 images should have been processed.');
        for(var i=1;i<=3;i++) {
            var selector = '#test-img' + i;
            var actualSrc = $fixture.find(selector).attr('src');
            var expectedSrc = utility.testData.resizeServiceUrl + '/resize=w:' + i*beginWidth + ',pd:1/' + utility.testData.dataSrc;
            assert.equal(actualSrc, expectedSrc, 'Incorrect src tag.');
        }

        QUnit.start();
    }

    // Act
    everliveImages.init({
        apiKey: 'kZddAw6QIAzVkjDl',
        ssl: true,
        onReady: _onReady
    });
});

QUnit.asyncTest("Can resize 2 images by parent container size and 1 user resize", function( assert ) {
    // Arrange
    expect(4); // expect three asserts

    var $fixture = $("#qunit-fixture");

    var beginWidth = 100;
    for(var i=1;i<=2;i++) {
        $fixture.append(utility.getImageInDivHtml('test-img'+i, utility.testData.dataSrc, beginWidth * i))
    }

    var expectedUserDefinedUrl = utility.testData.resizeServiceUrl + '/resize=w:53,h:84,fill:contain,pd:2/' + utility.testData.dataSrc;
    $fixture.append(utility.getImageInDivHtml('test-img-user', expectedUserDefinedUrl));

    var _onReady = function(data) {
        // Assert
        assert.equal(data.count, 3, '3 images should have been processed.');
        for(var i=1;i<=2;i++) {
            var selector = '#test-img' + i;
            var actualSrc = $fixture.find(selector).attr('src');
            var expectedSrc = utility.testData.resizeServiceUrl + '/resize=w:' + i*beginWidth + ',pd:1/' + utility.testData.dataSrc;
            assert.equal(actualSrc, expectedSrc, 'Incorrect src tag.');
        }

        var actualUserDefinedUrl = $fixture.find('#test-img-user').attr('src');
        assert.equal(actualUserDefinedUrl, expectedUserDefinedUrl, 'user defined url is missing.');

        QUnit.start();
    }

    // Act
    everliveImages.init({
        apiKey: 'kZddAw6QIAzVkjDl',
        ssl: true,
        onReady: _onReady
    });
});

QUnit.asyncTest("Does not change from HTTP to HTTPS user image", function( assert ) {
    // Arrange
    expect(3); // expect three asserts

    var $fixture = $("#qunit-fixture");

    $fixture.append(utility.getImageInDivHtml('test-img', utility.testData.httpDataSrc));

    var _onReady = function(data) {
        // Assert
        var expectedSrc = utility.testData.resizeServiceUrl + '/resize=w:600,pd:1/' + utility.testData.httpDataSrc;

        assert.equal(data.count, 1, 'Only 1 image should have been processed.');
        assert.ok(data.items[0].src, 'The item was not processed properly.');

        var actualSrc = $fixture.find('#test-img').attr('src');
        assert.equal(actualSrc, expectedSrc);

        QUnit.start();
    }

    // Act
    everliveImages.init({
        apiKey: 'kZddAw6QIAzVkjDl',
        ssl: true,
        onReady: _onReady
    });
});

QUnit.asyncTest("Can resize 1 image, then after change in dom can resize another 1.", function( assert ) {
    // Arrange
    expect(6); // expect three asserts

    var $fixture = $("#qunit-fixture");

    $fixture.append(utility.getImageInDivHtml('test-img', utility.testData.dataSrc));

    var _onReady = function(data) {
        var test1 = $fixture.find('#test-img');
        if(test1.length !== 0) {
            // Assert
            var expectedSrc = utility.testData.resizeServiceUrl + '/resize=w:600,pd:1/' + utility.testData.dataSrc;

            assert.equal(data.count, 1, 'Only 1 image should have been processed.');
            assert.ok(data.items[0].src, 'The item was not processed properly.');

            var actualSrc = $fixture.find('#test-img').attr('src');
            assert.equal(actualSrc, expectedSrc);

            $fixture.empty(); // clear all contents of the feature

            // start test #2.
            $fixture.append(utility.getImageInDivHtml('test-img-2', utility.testData.dataSrc, 100, 150));

            // Act for a second time
            everliveImages.responsiveAll();
        } else {
            assert.equal(data.count, 1, 'Only the second image should have been processed.');
            assert.ok(data.items[0].src, 'The item was processed properly.');

            var src2 = $fixture.find('#test-img-2').attr('src');
            var expectedSrc2 = utility.testData.resizeServiceUrl + '/resize=w:100,pd:1/' + utility.testData.dataSrc;
            assert.equal(src2, expectedSrc2, 'Source for second resize is as expected.');

            QUnit.start();
        }
    }

    // Act
    everliveImages.init({
        apiKey: 'kZddAw6QIAzVkjDl',
        ssl: true,
        onReady: _onReady
    });
});

QUnit.asyncTest("Does not set pd1 when user defined pixel density exist.", function( assert ) {
    // Arrange
    expect(1); // expect one assert

    var $fixture = $("#qunit-fixture");
    var userSpecifiedUrl = utility.testData.resizeServiceUrl + '/resize=w:100,h:150,pd:2/' + utility.testData.dataSrc;
    $fixture.append(utility.getImageInDivHtml('test-img', userSpecifiedUrl));

    var _onReady = function() {
        var actualSrc = $fixture.find('#test-img').attr('src');
        assert.equal(actualSrc, userSpecifiedUrl);

        QUnit.start();
    }

    // Act
    everliveImages.init({
        apiKey: 'kZddAw6QIAzVkjDl',
        ssl: true,
        onReady: _onReady
    });
});

/*
QUnit.asyncTest("Makes new request on windows resize.", function( assert ) {
    // Arrange
    expect(4); // expect one assert

    var $fixture = $("#qunit-fixture");
    var userSpecifiedUrl = utility.testData.resizeServiceUrl + '/resize=w:100,h:150,pd:2/' + utility.testData.dataSrc;
    $fixture.append(utility.getImageInDivHtml('test-img', userSpecifiedUrl));
    var onReadyCalledCount = 0;

    var _onReady = function(data) {
        onReadyCalledCount++;

        assert.equal(data.count, 1, 'Only 1 image should have been processed.');
        assert.ok(data.items[0].src, 'The item was not processed properly.');

        if(onReadyCalledCount === 2) {
            QUnit.start();
        } else {
            // trigger resize, which should process again the image.
            var handler = window.onresize;
            handler();
            //$(window).trigger('resize');
        }
    }

    // Act
    everliveImages.init({
        apiKey: 'kZddAw6QIAzVkjDl',
        ssl: true,
        onReady: _onReady
    });
});
*/