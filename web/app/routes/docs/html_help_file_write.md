## Handling Meta Parameters

Template engines for HTML are tools that help with dynamic content generation in web applications. They allow you to separate the HTML structure from the actual data, making it easier to manage and update the content. In template engines, variables are often defined within double curly braces **{{ }}**.

Here is an example of an HTML page with parameters using double curly braces:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{pageTitle}}</title>
</head>
<body>
    <header>
        <h1>Welcome, {{username}}!</h1>
    </header>
    <main>
        <p>This is your profile page. Your email is: {{email}}</p>
    </main>
    <footer>
        <p>&copy; 2021 My Website</p>
    </footer>
</body>
</html>
```

## How to reference a file in the same folder, for example a stylesheet file?
To link to a stylesheet file in the same application and use the public variable, you can add the following HTML code to your template:

```
<link rel="stylesheet" type="text/css" href="{{public}}/styles.css">
```

This code will create a link to the styles.css file in the public directory of your application, specified by the public variable. When the template is rendered in the browser, it will automatically load the styles from this file to apply to the page content.