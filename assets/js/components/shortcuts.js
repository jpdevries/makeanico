'use strict';

/*                       __                                 __               __                     __                    __
/\ \                     /\ \                               /\ \             /\ \                   /\ \__                /\ \__
\ \ \/'\      __   __  __\ \ \____    ___      __     _ __  \_\ \        ____\ \ \___     ___   _ __\ \ ,_\   ___   __  __\ \ ,_\   ____
\ \ , <    /'__`\/\ \/\ \\ \ '__`\  / __`\  /'__`\  /\`'__\/'_` \      /',__\\ \  _ `\  / __`\/\`'__\ \ \/  /'___\/\ \/\ \\ \ \/  /',__\
 \ \ \\`\ /\  __/\ \ \_\ \\ \ \L\ \/\ \L\ \/\ \L\.\_\ \ \//\ \L\ \    /\__, `\\ \ \ \ \/\ \L\ \ \ \/ \ \ \_/\ \__/\ \ \_\ \\ \ \_/\__, `\
  \ \_\ \_\ \____\\/`____ \\ \_,__/\ \____/\ \__/.\_\\ \_\\ \___,_\   \/\____/ \ \_\ \_\ \____/\ \_\  \ \__\ \____\\ \____/ \ \__\/\____/
   \/_/\/_/\/____/ `/___/> \\/___/  \/___/  \/__/\/_/ \/_/ \/__,_ /    \/___/   \/_/\/_/\/___/  \/_/   \/__/\/____/ \/___/   \/__/\/___/
                      /\___/
                      \/_*/

document.addEventListener('keyup', function (event) {
  if (event.ctrlKey && event.which === 65) $('select_all_cells').click();
  if (event.ctrlKey && event.which === 68) $('unselect_all_cells').click();
  if (event.ctrlKey && event.which === 73) $('inverse_selection').click();

  /*if (event.ctrlKey && event.which === 8) { // ctrl + backspace
      $('inverse_selection').click();
  }*/
});
