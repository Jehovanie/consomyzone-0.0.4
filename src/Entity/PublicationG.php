<?php



namespace App\Entity;



use App\Repository\PublicationGRepository;

use Doctrine\ORM\Mapping as ORM;



use App\Entity\User;





/**

 * @ORM\Table(name="publication_g", indexes={@ORM\Index(name="IDX_705B3727A76ED395", columns={"user_id"})})

 * @ORM\Entity(repositoryClass=PublicationGRepository::class)

 */

class PublicationG

{

    /**

     * @ORM\Id

     * @ORM\GeneratedValue

     * @ORM\Column(type="integer")

     */

    private $id;



    /**

     * @ORM\Column(type="string", length=255)

     */

    private $legend;



    /**

     * @ORM\Column(type="datetime")

     */

    private $datetime;



    /**

     * @ORM\Column(type="integer")

     */

    private $confidentiality;



    /**

     *

     * @ORM\ManyToOne(targetEntity=User::class)

     * @ORM\JoinColumns({

     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")

     * })

     */

    private $user_id;



    /**
     * @ORM\Column(type="integer", nullable=true)
     */

    private $tributg_id;



    /**

     * @ORM\Column(type="string", length=255, nullable=true)

     */

    private $photo;



    public function getId(): ?int

    {

        return $this->id;

    }



    public function getLegend(): ?string

    {

        return $this->legend;

    }



    public function setLegend(string $legend): self

    {

        $this->legend = $legend;

       

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



    public function getConfidentiality(): ?int

    {

        return $this->confidentiality;

    }



    public function setConfidentiality(int $confidentiality): self

    {

        $this->confidentiality = $confidentiality;



        return $this;

    }



    public function getUserId(): ?User

    {

        return $this->user_id;

    }



    public function setUserId(?User $user): self

    {

        $this->user_id = $user;



        return $this;

    }



    public function getTributgId()

    {

        return $this->tributg_id;

    }



    public function setTributgId($tributg): self

    {

        $this->tributg_id = $tributg;



        return $this;

    }



    public function getPhoto(): ?string

    {

        return $this->photo;

    }



    public function setPhoto(?string $photo): self

    {

        $this->photo = $photo;



        return $this;

    }

}

