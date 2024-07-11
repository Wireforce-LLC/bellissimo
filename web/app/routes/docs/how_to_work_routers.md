## How to work with routers

The Bellissimo router is a feature that allows you to listen to specific paths on your domain and control the routing of traffic within your Bellissimo application. By setting up routers, you can direct traffic to different pages or components based on the URL path.

## Setting up the Router

To set up the Bellissimo router, first ensure that you have your domain connected to Cloudflare. Follow these steps to create a router:

- Access your Bellissimo application with the IP address where it is hosted (e.g. 10.10.10.10).
- Navigate to the router settings in the Bellissimo dashboard.
- Specify the domain and path you want to listen to.

🏷 Important aspects:

- When specifying the domain as **Any** and the path as **index**, all domains will be directed to the root path domain.com/. This allows you to create a consistent behavior across all domains, which can be useful for the home page or all information.

- If you specify a specific domain and path (for example, *example.com* and *profile* (example.com/profile)), only traffic to *example.com/profile* will be sent. This allows you to more accurately target users on browser pages or components based on the URL.

## Params
Each router contains parameters that can be set using a meta field. These parameters allow you to modify the behavior of the resource that was selected in the router and configure it according to the needs of the application.

## Usage
Once you have set up your routers, Bellissimo will automatically direct incoming traffic to the specified paths based on the URL. This allows you to create custom routing within your application and provide a seamless user experience.

