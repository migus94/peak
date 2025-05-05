# Implementación

Aquí ponemos ejemplos de código:

```java
    Class.forName("com.mysql.jdbc.Driver");
    connect = DriverManager
            .getConnection("jdbc:mysql://localhost/database?"
                    + "user=root&password=secreto123");
```

Para explicar cómo hacemos los puntos más críticos del proyecto.