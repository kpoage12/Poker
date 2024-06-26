
var tests = ["straight_flush", "four_of_a_kind", "full_house", "flush", "straight", "three_of_a_kind", "two_pair", "one_pair", "high_card"];

function getWinners(players){
    var winners;
    for (var i = 0; i < tests.length; i++){
        winners = winnersHelper(players, tests[i]);
        if (winners){
            break;
        }
    }

    return winners;
}

function winnersHelper(players, test){
    var best;
    var winners = new Array(players.length);
    for (var i=0; i<players.length; i++){
        if (!players[i]){
            continue;
        }
    }
}