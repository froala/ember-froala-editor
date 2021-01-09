import Controller from '@ember/controller';
import { htmlSafe } from '@ember/template';

export default class ApplicationController extends Controller {
  content = htmlSafe('<p>Foobar</p>');
}
