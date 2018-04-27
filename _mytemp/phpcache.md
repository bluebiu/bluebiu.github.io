php

memcached
    Memcached::OPT_CONNECT_TIMEOUT
    在非阻塞模式下这里设置的值就是socket连接的超时时间，单位是毫秒。
    类型: integer, 默认: 1000.

    Memcached::OPT_RETRY_TIMEOUT
    等待失败的连接重试的时间，单位秒。
    类型: integer, 默认: 0.

    Memcached::OPT_SEND_TIMEOUT
    socket发送超时时间，单位微秒。在这种情况下您不能使用非阻塞I/O，这将使得您仍然有数据会发送超时。
    类型: integer, 默认: 0.

    Memcached::OPT_RECV_TIMEOUT
    socket读取超时时间，单位微秒。在这种情况下您不能使用非阻塞I/O，这将使得您仍然有数据会读取超时。
    类型: integer, 默认: 0.

    Memcached::OPT_POLL_TIMEOUT
    poll连接超时时间，单位毫秒。
    类型: integer, 默认: 1000.

memcache
    timeout 连接持续（超时）时间，单位秒。默认值1秒，修改此值之前请三思，过长的连接持续时间可能会导致失去所有的缓存优势
    bool Memcache::connect ( string $host [, int $port [, int $timeout ]] )

    bool Memcache::addServer ( string $host [, int $port = 11211 [, bool $persistent [, int $weight [, int $timeout [, int $retry_interval [, bool $status [, callback $failure_callback [, int $timeoutms ]]]]]]]] )

redis
    $this->redis->connect($host, $port,3); 3秒连接超时

    connect, open
    [phpredis/phpredis: A PHP extension for Redis](https://github.com/phpredis/phpredis)
    Description: Connects to a Redis instance.
    Parameters
    host: string. can be a host, or the path to a unix domain socket
    port: int, optional
    timeout: float, value in seconds (optional, default is 0 meaning unlimited)
    reserved: should be NULL if retry_interval is specified
    retry_interval: int, value in milliseconds (optional)
    read_timeout: float, value in seconds (optional, default is 0 meaning unlimited)