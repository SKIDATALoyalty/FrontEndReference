import { AppPage } from './app.po';

describe('loyalty-front-end-poc App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome To Loyalty');
  });
});
