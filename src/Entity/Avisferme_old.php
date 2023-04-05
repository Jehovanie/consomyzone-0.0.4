<?php



namespace App\Entity;



use Doctrine\ORM\Mapping as ORM;



/**

 * Avisferme

 *

 * @ORM\Table(name="avisferme", indexes={@ORM\Index(name="IDX_F4C2D6D8A76ED395", columns={"user_id"}), @ORM\Index(name="IDX_F4C2D6D818981132", columns={"ferme_id"})})

 * @ORM\Entity(repositoryClass="App\Repository\AvisfermeRepository")

 */

class Avisferme_old

{

   /**

     * @ORM\Id

     * @ORM\GeneratedValue

     * @ORM\Column(type="integer")

     */

    private $id;



    /**

     * @var string

     *

     * @ORM\Column(name="comment", type="text", nullable=false)

     */

    private $comment;



    /**

     * @var int

     *

     * @ORM\Column(name="note", type="integer", nullable=false)

     */

    private $note;



    /**

     * @var \DateTime

     *

     * @ORM\Column(name="datetime", type="datetime", nullable=false, options={"default"="CURRENT_TIMESTAMP"})

     */

    private $datetime = 'CURRENT_TIMESTAMP';



    /**

     *

     * @ORM\ManyToOne(targetEntity="User")

     * @ORM\JoinColumns({

     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")

     * })

     */

    private $user;



    /**

     * @var \FermeGeom

     *

     * @ORM\ManyToOne(targetEntity="FermeGeom")

     * @ORM\JoinColumns({

     *   @ORM\JoinColumn(name="ferme_id", referencedColumnName="id")

     * })

     */

    private $ferme;



    /**

     * 

     * @ORM\Column(name="reactionAccueil", type="string")

     */

    private $reactionAccueil;



    /**

     * 

     * @ORM\Column(name="reactionPrix", type="string")

     */

    private $reactionPrix;



    /**

     * 

     * @ORM\Column(name="reactionQualiteP", type="string")

     */

    private $reactionQualiteP;



    /**

     * @var int

     *

     * @ORM\Column(name="noteAccueil", type="integer", nullable=false)

     */

    private $noteAccueil;



    /**

     * @var int

     *

     * @ORM\Column(name="notePrix", type="integer", nullable=false)

     */

    private $notePrix;



    /**

     * @var int

     *

     * @ORM\Column(name="noteQualiteP", type="integer", nullable=false)

     */

    private $noteQualiteP;



    public function getId(): ?int

    {

        return $this->id;

    }



    public function getComment(): ?string

    {

        return $this->comment;

    }



    public function setComment(string $comment): self

    {

        $this->comment = $comment;



        return $this;

    }



    public function getNote(): ?int

    {

        return $this->note;

    }



    public function setNote(int $note): self

    {

        $this->note = $note;



        return $this;

    }



    public function getDatetime(): ?\DateTimeInterface

    {

        return $this->datetime;

    }



    public function setDatetime(\DateTimeInterface $datetime): self

    {

        $this->datetime = $datetime;



        return $this;

    }



    public function getUser()

    {

        return $this->user;

    }



    public function setUser(?User $user): self

    {

        $this->user = $user;



        return $this;

    }



    public function getFerme()

    {

        return $this->ferme;

    }



    public function setFerme(?FermeGeom $ferme): self

    {

        $this->ferme = $ferme;



        return $this;

    }







    /**

     * Get the value of reactionPrix

     */ 

    public function getReactionPrix()

    {

        return $this->reactionPrix;

    }



    /**

     * Set the value of reactionPrix

     *

     * @return  self

     */ 

    public function setReactionPrix($reactionPrix)

    {

        $this->reactionPrix = $reactionPrix;



        return $this;

    }



    /**

     * Get the value of reactionAccueil

     */ 

    public function getReactionAccueil()

    {

        return $this->reactionAccueil;

    }



    /**

     * Set the value of reactionAccueil

     *

     * @return  self

     */ 

    public function setReactionAccueil($reactionAccueil)

    {

        $this->reactionAccueil = $reactionAccueil;



        return $this;

    }



    /**

     * Get the value of reactionQualiteP

     */ 

    public function getReactionQualiteP()

    {

        return $this->reactionQualiteP;

    }



    /**

     * Set the value of reactionQualiteP

     *

     * @return  self

     */ 

    public function setReactionQualiteP($reactionQualiteP)

    {

        $this->reactionQualiteP = $reactionQualiteP;



        return $this;

    }





    /**

     * Get the value of notePrix

     *

     * @return  int

     */ 

    public function getNotePrix()

    {

        return $this->notePrix;

    }



    /**

     * Set the value of notePrix

     *

     * @param  int  $notePrix

     *

     * @return  self

     */ 

    public function setNotePrix(int $notePrix)

    {

        $this->notePrix = $notePrix;



        return $this;

    }



    /**

     * Get the value of noteQualiteP

     *

     * @return  int

     */ 

    public function getNoteQualiteP()

    {

        return $this->noteQualiteP;

    }



    /**

     * Set the value of noteQualiteP

     *

     * @param  int  $noteQualiteP

     *

     * @return  self

     */ 

    public function setNoteQualiteP(int $noteQualiteP)

    {

        $this->noteQualiteP = $noteQualiteP;



        return $this;

    }



    /**

     * Get the value of noteAccueil

     *

     * @return  int

     */ 

    public function getNoteAccueil()

    {

        return $this->noteAccueil;

    }



    /**

     * Set the value of noteAccueil

     *

     * @param  int  $noteAccueil

     *

     * @return  self

     */ 

    public function setNoteAccueil(int $noteAccueil)

    {

        $this->noteAccueil = $noteAccueil;



        return $this;

    }

}

