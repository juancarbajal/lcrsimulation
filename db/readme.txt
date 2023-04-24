redis-cli
AUTH "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81"
LPUSH game:queue:case '3 LRC**LRC**CRL*LRCR'
LPUSH game:queue:case '3 LLLLLL.'
LPUSH game:queue:case '4 LRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCR'
LPUSH game:queue:case '6 LRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCRLRC..LRC..CRL.LRCR'
LPUSH game:queue:case '3 CCCCCC...'


redis-commander --redis-host localhost --redis-port 6379 --redis-password eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81
