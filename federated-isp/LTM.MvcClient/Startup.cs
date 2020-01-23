using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.AspNetCore.HttpOverrides;

namespace LTM.MvcClient
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
                })
                .AddCookie()
                .AddOpenIdConnect(options =>
                {
                    options.MetadataAddress = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_II8KXhipn/.well-known/openid-configuration";
                    options.ResponseType = OpenIdConnectResponseType.Code;
                    options.ClientId = "5lta3v67n27qb71s55k5lq3lhi";
                    options.ClientSecret = "1s0r42ib6mfil67j8ntmk5mksudd7sbf226i0tv8phj43o1638am";
                    //options.SaveTokens = true;
                    //local
                    // options.Authority = "https://localhost:5001";
                    // options.ClientId = "ltm";
                    // options.ClientSecret = "ltm-secret";
                    //cognito
                    //CDJvU7q+m9iNc9mrTvx2wC7GM8IdtTtk1Fg+dv7D9Cs=
                    //options.Authority = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_II8KXhipn";
                    
                    
                    //options.Scope.Add("openid");
                    //options.Scope.Add("profile");
                    //options.UsePkce = false;
                });
            services.AddAuthorization();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHttpsRedirection();
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedProto
            });
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDefaultControllerRoute();
            });
        }
    }
}
