<?php


namespace App\Extensions\Doctrine;

// Abstract Syntax Tree (AST)
// utilisées par Doctrine pour représenter les différentes parties d'une requête DQL
// L'AST est une structure de données arborescente qui représente la syntaxe abstraite d'une requête
use Doctrine\ORM\Query\AST\Functions\FunctionNode;

// Scans a DQL query for tokens.
// elle est utilisée pour analyser et découper une chaîne de caractères en éléments lexicaux plus petits, appelés "tokens".
use Doctrine\ORM\Query\Lexer;

class MatchAgainst extends FunctionNode
{
    /** @var array list of \Doctrine\ORM\Query\AST\PathExpression */
    protected $pathExp = null;

    /** @var string */
    protected $against = null;

    /** @var bool */
    protected $booleanMode = false;

    /** @var bool */
    protected $queryExpansion = false;

    
    public function parse(\Doctrine\ORM\Query\Parser $parser)
    {
        // match
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);

        // first Path Expression is mandatory
        $this->pathExp = [];
        $this->pathExp[] = $parser->StateFieldPathExpression();

        // Subsequent Path Expressions are optional
        $lexer = $parser->getLexer();
        while ($lexer->isNextToken(Lexer::T_COMMA)) {
            $parser->match(Lexer::T_COMMA);
            $this->pathExp[] = $parser->StateFieldPathExpression();
        }
        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
        // against
        
        
        $tmp=is_object($lexer->lookahead) ? (get_object_vars($lexer->lookahead))["value"]: $lexer->lookahead['value'];
        if (strtolower($tmp) !== 'against') {
            $parser->syntaxError('against');
        }

        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);
        $this->against = $parser->StringPrimary();
$tmp=is_object($lexer->lookahead) ? (get_object_vars($lexer->lookahead))["value"]: $lexer->lookahead['value'];

        if (strtolower($tmp) === 'boolean') {
            $parser->match(Lexer::T_IDENTIFIER);
            $this->booleanMode = true;
        }
        if (strtolower($tmp) === 'expand') {
            $parser->match(Lexer::T_IDENTIFIER);
            $this->queryExpansion = true;
        }

        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }



    // Doctrine\ORM\Query\SqlWalker: utilisée dans le composant ORM de Doctrine 
    // pour générer des requêtes SQL à partir de l'Abstract Syntax Tree (AST) d'une requête DQL.
    public function getSql(\Doctrine\ORM\Query\SqlWalker $walker)
    {
        $fields = [];
        foreach ($this->pathExp as $pathExp) {
            $fields[] = $pathExp->dispatch($walker);
        }
        $against = $walker->walkStringPrimary($this->against)
            . ($this->booleanMode ? ' IN BOOLEAN MODE' : '')
            . ($this->queryExpansion ? ' WITH QUERY EXPANSION' : '');
        return sprintf('MATCH (%s) AGAINST (%s)', implode(', ', $fields), $against);
    }
}