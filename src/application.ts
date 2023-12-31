import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, RefreshTokenServiceBindings, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MongoDbDataSource} from './datasources';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class JwtApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(MongoDbDataSource, UserServiceBindings.DATASOURCE_NAME);

    //BIND DATASOURCE FROM REFRESH TOKEN....
    this.dataSource(MongoDbDataSource, RefreshTokenServiceBindings.DATASOURCE_NAME);

    // BIND FOR ACCESS JWT TOKEN EXPIRES IN....
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to('10')

    // BIND FOR REFRESH JWT TOKEN EXPIRES TIME IN.....
    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to('60')

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
