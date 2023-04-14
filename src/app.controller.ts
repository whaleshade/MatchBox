import { Controller, Get, Redirect, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guard/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  private createOauthUrl(): string {
    const clientId =
      'u-s4t2ud-cafde703fab6ae68159fb938dc4bab30a128b70e2cce609bb0571e85d22785ab';
    const redirectUri = encodeURIComponent(
      'http://127.0.0.1:3000/auth/callback',
    );
    const responseType = 'code';

    return `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`;
  }

  @Get('login')
  @Redirect('', 302)
  oauthLogin(): { url: string } {
    return { url: this.createOauthUrl() };
  }

  /* test for authGuard */
  // @Get('protected')
  // @UseGuards(AuthGuard)
  // protectedPageTest(@Request() req): any {
  //   const { id } = req.id;
  //   console.log(id);
  //   return 'protected for login user';
  // }
}
