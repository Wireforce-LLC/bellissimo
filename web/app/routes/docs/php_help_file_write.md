- [cURL](?id=php_curl)
- [Include other files](?id=php_include)

## Handling Meta Parameters

To access meta parameters in your PHP script, you can use the $_GET array. For example, if the URL is http://example.com/resource.php?param1=value1&param2=value2, you can access these parameters in your PHP code as follows:

```
$param1 = $_GET['param1'];
$param2 = $_GET['param2'];
```

<p style="color:#0984e3;">
Additionally, any custom or system-defined meta parameters will also be available in the $GET array, regardless of the type of request. This allows you to easily retrieve and utilize these parameters in your PHP scripts.
</p>

## Custom Headers Limitation

It is important to note that PHP files in the Bellissimo ecosystem cannot send custom headers. Therefore, any customization of HTTP headers needs to be handled through server configuration.

## Caching Updates

Every modification made to a resource may be temporarily cached until the changes become available in the production environment. This ensures that the latest updates are always accessible to the end-users.
