import augment, { TSetupAccountsFunc } from '@acryl/js-test-env/augment';
import { TSuite } from '@services/TestRunner';

const convert = (x: TSuite): any => {
    return {
        title: x.title,
        fullTitle: x.fullTitle(),
        tests: x.tests.map(x => ({title: x.title, fullTitle: x.fullTitle()})),
        suites: x.suites.map(x => convert(x))
    };
};

export const injectTestEnvironment = (iframeWindow: any,
    setupAccountsWrapper?: (f: TSetupAccountsFunc) => TSetupAccountsFunc) => {
    iframeWindow.env = {};

    augment(iframeWindow, {setupAccountsWrapper});

    iframeWindow.compileTest = (test: string) => {
        try {
            iframeWindow.eval(test);
            return {
                result: convert(iframeWindow.mocha.suite)
            };
        } catch (e) {
            return {
                error: e.message
            };
        }
    };

    iframeWindow.global = iframeWindow;
};
