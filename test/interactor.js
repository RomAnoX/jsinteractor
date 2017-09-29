var expect = require('chai').expect;
var interactor = require('../interactor');

describe('interactor', function() {
  it('should build an interactor', function() {
    var test = interactor(function() {});
    expect(test.isInteractor).to.be.true;
  });

  it('should receive context', function() {
    var test = interactor(function() {});
    expect(test({ name: 'test' })).to.deep.equal({
      success: true,
      name: 'test',
    });
  });

  it('can modify context', function() {
    var test = interactor(function() {
      this.context.test = true;
      this.context.name = 'test';
    });

    expect(test({ test: false })).to.deep.equal({
      success: true,
      test: true,
      name: 'test',
    });
  });

  it('can fail context', function() {
    var test = interactor(function() {
      this.context.test = true;
      this.context.fail();
    });

    expect(test({})).to.deep.equal({
      failure: true,
      test: true,
    });
  });

  describe('hooks', function() {
    var testInteractor = null;

    beforeEach(function() {
      testInteractor = interactor(function() {
        this.context.interactor = true;
      });
    });

    it('should have a before hook', function() {
      testInteractor.before(function() {
        this.context.before = true;
      });

      expect(testInteractor({})).to.deep.equal({
        success: true,
        before: true,
        interactor: true,
      });
    });

    it('should run multiple before hooks', function() {
      testInteractor.before(function() {
        this.context.before1 = true;
      });

      testInteractor.before(function() {
        this.context.before2 = true;
      });

      expect(testInteractor({})).to.deep.equal({
        success: true,
        before1: true,
        before2: true,
        interactor: true,
      });
    });
  });
});
