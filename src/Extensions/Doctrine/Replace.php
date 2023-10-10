<?php
namespace App\Extensions\Doctrine;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\Parser;
use Doctrine\ORM\Query\SqlWalker;
 
class Replace extends FunctionNode
{
    public $value;
 
    public function parse(Parser $parser)
    {
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);
        $this->value = $parser->StringPrimary();
        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }
 
    public function getSql(SqlWalker $sqlWalker)
    {
        //return 'REPLACE(' . $this->value->dispatch($sqlWalker) . ', "  ", " ")';
        return 'REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(' 
        . $this->value->dispatch($sqlWalker) . ', "  ", " "), "#", ""), "$", ""), "-", ""), "@", ""), "&", ""), "|", ""), "+", ""), 
        "*", ""), "/", ""), ".", ""), ",", ""), ";", ""), "?", ""), "!", ""), "\'", ""), "\"", ""), ":", ""), "`", ""), "(", "")
        , ")", ""), "[", ""), "]", ""), "{", ""), "}", ""), "\=", ""), "~", ""), "_", ""), "«", ""), "»", ""), "<", ""), ">", "")';
    }
}