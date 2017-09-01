delete from hands where gameid in (select gameid from games where playerid=$1);
delete from games where gameid in (select gameid from games where playerid=$1);
