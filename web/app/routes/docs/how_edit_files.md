## How to edit files right
- [Lifehacks for PHP](?id=php_help_file_write)
- [Lifehacks for HTML](?id=html_help_file_write)
- [Scenario](?id=scenario)
<br/>

## How to create an indexed resource
Not all resources that you create in the public content folder will be indexed when you create a resource or filter. To make your file appear in the file selection line when creating a resource, use a file named index inside any folder.


For example, __what structure will be indexed__:

✅️️ _/main/index.php_

And there is no such thing anymore:

❌ _/main.php_


## Variables
For each resource, Bellissimo adds meta parameters. The most popular and default parameters can be found below

- **time**: Current timestamp in string format.
- **hello_rust**: A string indicating the presence of Rust language.
- **ip**: Client's IP address.
- **client-ip**: Same as the client's IP address.
- **user-agent**: User agent string indicating the client's browser type.
- **utc-time**: Current timestamp in UTC.
- **nanoid**: A randomly generated alphanumeric string of length 16.
- **is-bellisimo**: A boolean indicating true.
- **domain**: The domain name (default to "localhost").
- **pwd**: Path to the working directory.
- **public**: Path to the public directory based on the resource file path.
- **static**: Same as the public.
