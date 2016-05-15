/*
** variable.c for marvin in /home/loic/rendu/marvin_pirez_l/src/
**
** Made by Loïc Pirez
** Login   <loic.pirez@epitech.eu>
**
** Started on  Sat May 14 16:03:10 2016 Loïc Pirez
** Last update Sun May 15 00:36:08 2016 Loïc Pirez
*/
#include	<stdio.h>
#include	<stdlib.h>
#include	"marvin.h"

void		init_variable_struct(t_variable *variable)
{
  variable->type = NULL;
  variable->name = NULL;
  variable->has_stars = FALSE;
  variable->nb_stars = 0;
}

void		variable_case(char *s)
{
  t_variable	variable;

  init_variable_struct(&variable);
  variable.type = get_type_name(s);
  get_name_var(&variable, s);
  sentence_variable(&variable);
}
